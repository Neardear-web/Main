const MSG91_API_KEY = process.env.MSG91_API_KEY
const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID ?? 'NRDEAR'
const MSG91_BASE_URL = 'https://api.msg91.com/api/v5'

// ─── WhatsApp ─────────────────────────────────────────

/**
 * A button component as defined in the WhatsApp Business template.
 * sub_type: 'url'         → CTA button with dynamic URL suffix
 * sub_type: 'quick_reply' → reply button (no dynamic params needed)
 * index: position of this button in the template (0-based string)
 */
interface WaButton {
  sub_type: 'url' | 'quick_reply'
  index: string
  parameters: { type: 'text' | 'payload'; text: string }[]
}

async function sendWhatsApp(
  phone: string,
  templateId: string,
  variables: string[],
  buttons?: WaButton[]
): Promise<boolean> {
  const formatted = phone.startsWith('91')
    ? phone
    : `91${phone.replace(/^\+91/, '').replace(/^0/, '')}`

  // Build components array:
  // - one 'body' component with ALL variables as parameters
  // - one 'button' component per interactive button
  const components: object[] = []

  if (variables.length > 0) {
    components.push({
      type: 'body',
      parameters: variables.map((v) => ({ type: 'text', text: v })),
    })
  }

  if (buttons && buttons.length > 0) {
    for (const btn of buttons) {
      components.push({
        type: 'button',
        sub_type: btn.sub_type,
        index: btn.index,
        parameters: btn.parameters,
      })
    }
  }

  try {
    const res = await fetch(
      `${MSG91_BASE_URL}/whatsapp/whatsapp-outbound-message/bulk/`,
      {
        method: 'POST',
        headers: {
          authkey: MSG91_API_KEY!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          integrated_number: process.env.MSG91_WHATSAPP_NUMBER,
          content_type: 'template',
          payload: {
            to: formatted,
            type: 'template',
            template: {
              name: templateId,
              language: { code: 'en' },
              components,
            },
          },
        }),
      }
    )

    const result = await res.json() as { type?: string; message?: string }
    if (
      result.type === 'success' ||
      result.message === 'Request Sent Successfully'
    ) {
      console.log('[WHATSAPP SENT]', {
        phone: formatted.slice(-4),
        template: templateId,
      })
      return true
    }
    console.error('[WHATSAPP FAILED]', result)
    return false
  } catch (err) {
    console.error('[WHATSAPP ERROR]', err)
    return false
  }
}

// ─── SMS (Flow API) ───────────────────────────────────

async function sendSMS(
  phone: string,
  templateId: string | undefined,
  variables: string[]
): Promise<boolean> {
  if (!MSG91_API_KEY || !templateId) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[SMS MOCK]', { phone: phone.slice(-4), templateId, variables })
    }
    return false
  }

  const formatted = phone.startsWith('91')
    ? phone
    : `91${phone.replace(/^\+91/, '').replace(/^0/, '')}`

  try {
    const res = await fetch(`${MSG91_BASE_URL}/flow/`, {
      method: 'POST',
      headers: {
        authkey: MSG91_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        template_id: templateId,
        short_url: '0',
        sender: MSG91_SENDER_ID,
        recipients: [
          {
            mobiles: formatted,
            var1: variables[0] ?? '',
            var2: variables[1] ?? '',
            var3: variables[2] ?? '',
            var4: variables[3] ?? '',
            var5: variables[4] ?? '',
          },
        ],
      }),
    })

    const result = await res.json() as { type?: string }
    if (result.type === 'success') {
      console.log('[SMS SENT]', { phone: formatted.slice(-4), templateId })
      return true
    }
    console.error('[SMS FAILED]', result)
    return false
  } catch (err) {
    console.error('[SMS ERROR]', err)
    return false
  }
}

// ─── Core dispatcher — WhatsApp first, SMS fallback ───

async function sendNotification(
  phone: string,
  waTemplateId: string | undefined,
  smsTemplateId: string | undefined,
  variables: string[],
  buttons?: WaButton[]
): Promise<void> {
  // Dev mode — just log
  if (!MSG91_API_KEY) {
    console.log('[NOTIFICATION MOCK]', {
      phone: phone.slice(-4),
      variables,
    })
    return
  }

  // Try WhatsApp first
  if (waTemplateId && process.env.MSG91_WHATSAPP_NUMBER) {
    const sent = await sendWhatsApp(phone, waTemplateId, variables, buttons)
    if (sent) return
    console.log('[WA FAILED — FALLING BACK TO SMS]')
  }

  // SMS fallback (buttons are WA-only — SMS gets plain variables only)
  await sendSMS(phone, smsTemplateId, variables)
}

// ─── OTP — SMS only (more reliable for time-sensitive) ─

export async function sendOTPSms(
  phone: string,
  otp: string
): Promise<void> {
  if (!MSG91_API_KEY) {
    console.log(`[OTP MOCK] ${phone.slice(-4)}: ${otp}`)
    return
  }
  await sendSMS(phone, process.env.MSG91_OTP_TEMPLATE_ID, [otp])
}

// ─── Named notification exports ───────────────────────

export async function sendSessionConfirmedSms(
  phone: string,
  companionName: string,
  date: string,
  time: string
): Promise<void> {
  await sendNotification(
    phone,
    process.env.MSG91_WA_PAYMENT_TEMPLATE,
    process.env.MSG91_SESSION_TEMPLATE_ID,
    [companionName, date, time]
  )
}

export async function sendCheckinSms(
  phone: string,
  companionName: string,
  time: string,
  sessionId?: string,
  location?: string
): Promise<void> {
  // WA body variables: companionName, location (or blank), time
  const variables = [companionName, location ?? '', time]

  // "View session" URL button — index 0 in the WA template
  // Template URL defined as: https://neardear.in/session/{{1}}
  // "Call us" is a static call button — no dynamic params needed (index 1)
  const buttons: WaButton[] = sessionId
    ? [{ sub_type: 'url', index: '0', parameters: [{ type: 'text', text: sessionId }] }]
    : []

  await sendNotification(
    phone,
    process.env.MSG91_WA_CHECKIN_TEMPLATE,
    process.env.MSG91_CHECKIN_TEMPLATE_ID,
    variables,
    buttons
  )
}

export async function sendSessionCompleteSms(
  phone: string
): Promise<void> {
  await sendNotification(
    phone,
    process.env.MSG91_WA_NOTE_TEMPLATE,
    process.env.MSG91_COMPLETE_TEMPLATE_ID,
    []
  )
}

export async function sendPaymentConfirmedSms(
  phone: string,
  amount: string,
  companionName: string,
  date: string
): Promise<void> {
  await sendNotification(
    phone,
    process.env.MSG91_WA_PAYMENT_TEMPLATE,
    process.env.MSG91_PAYMENT_TEMPLATE_ID,
    [amount, companionName, date]
  )
}

export async function sendEarningPaidSms(
  phone: string,
  amount: string
): Promise<void> {
  await sendNotification(
    phone,
    process.env.MSG91_WA_EARNING_TEMPLATE,
    process.env.MSG91_EARNING_TEMPLATE_ID,
    [amount]
  )
}

export async function sendNewRequestSms(
  phone: string,
  earnings: string
): Promise<void> {
  await sendNotification(
    phone,
    process.env.MSG91_WA_REQUEST_TEMPLATE,
    process.env.MSG91_REQUEST_TEMPLATE_ID,
    [earnings]
  )
}

export async function sendAccountApprovedSms(
  phone: string,
  name: string
): Promise<void> {
  await sendNotification(
    phone,
    process.env.MSG91_WA_APPROVED_TEMPLATE,
    process.env.MSG91_APPROVED_TEMPLATE_ID,
    [name]
  )
}

export async function sendRefundSms(
  phone: string,
  amount: string
): Promise<void> {
  await sendNotification(
    phone,
    process.env.MSG91_WA_CANCELLATION_TEMPLATE,
    process.env.MSG91_REFUND_TEMPLATE_ID,
    [amount]
  )
}

export async function sendWarningSms(phone: string): Promise<void> {
  await sendNotification(
    phone,
    process.env.MSG91_WA_WARNING_TEMPLATE,
    process.env.MSG91_WARNING_TEMPLATE_ID,
    []
  )
}

export async function sendSosReceivedSms(
  phone: string,
  city: string
): Promise<void> {
  await sendNotification(
    phone,
    process.env.MSG91_WA_SOS_TEMPLATE,
    process.env.MSG91_SOS_TEMPLATE_ID,
    [city]
  )
}

export async function sendSosFoundSms(
  phone: string,
  companionName: string,
  caseId: string
): Promise<void> {
  await sendNotification(
    phone,
    process.env.MSG91_WA_SOS_TEMPLATE,
    process.env.MSG91_SOS_FOUND_TEMPLATE_ID,
    [companionName, caseId]
  )
}

export async function sendBonusCreditedSms(
  phone: string,
  amount: string,
  occasion: string
): Promise<void> {
  await sendNotification(
    phone,
    process.env.MSG91_WA_BONUS_TEMPLATE,
    process.env.MSG91_BONUS_TEMPLATE_ID,
    [amount, occasion]
  )
}

export async function sendCancellationSms(
  phone: string,
  refundAmount: string
): Promise<void> {
  await sendNotification(
    phone,
    process.env.MSG91_WA_CANCELLATION_TEMPLATE,
    process.env.MSG91_CANCEL_TEMPLATE_ID,
    [refundAmount]
  )
}

export async function sendRateChangeSms(
  phone: string,
  newRate: string,
  direction: 'increased' | 'decreased'
): Promise<void> {
  await sendNotification(
    phone,
    process.env.MSG91_WA_RATE_TEMPLATE,
    process.env.MSG91_RATE_CHANGE_TEMPLATE_ID,
    [direction, newRate]
  )
}
