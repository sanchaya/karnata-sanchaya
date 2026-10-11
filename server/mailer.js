export const emailDeliveryConfigured=config=>Boolean(config.mail?.apiKey&&config.mail?.from)

export async function sendPasswordResetEmail({to,url,locale='kn',config,fetchImpl=fetch}){
  if(!emailDeliveryConfigured(config)){
    if(config.env==='production')throw new Error('Password-reset email delivery is not configured.')
    return {previewUrl:url}
  }
  const kannada=locale!=='en'
  const subject=kannada?'ಕರ್ನಾಟಕ ಐತಿಹಾಸಿಕ ಅಟ್ಲಸ್ ಗುಪ್ತಪದ ಮರುಹೊಂದಿಸಿ':'Reset your Karnataka Historical Atlas password'
  const text=kannada
    ? `ನಿಮ್ಮ ಗುಪ್ತಪದ ಮರುಹೊಂದಿಸಲು ಈ ಸುರಕ್ಷಿತ ಕೊಂಡಿಯನ್ನು ತೆರೆಯಿರಿ. ಕೊಂಡಿ ${config.passwordResetMinutes} ನಿಮಿಷಗಳಲ್ಲಿ ಅವಧಿ ಮೀರುತ್ತದೆ.\n\n${url}\n\nಈ ವಿನಂತಿ ನಿಮ್ಮದಲ್ಲದಿದ್ದರೆ ಇದನ್ನು ನಿರ್ಲಕ್ಷಿಸಿ.`
    : `Open this secure link to reset your password. It expires in ${config.passwordResetMinutes} minutes.\n\n${url}\n\nIgnore this message if you did not request it.`
  const response=await fetchImpl('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${config.mail.apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({from:config.mail.from,to:[to],subject,text})})
  if(!response.ok)throw new Error(`Password-reset email delivery failed (${response.status}).`)
  return response.json().catch(()=>({ok:true}))
}
