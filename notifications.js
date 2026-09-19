async function send(channel, payload) {
  const isSms = channel.toLowerCase().includes('sms');
  const url = isSms ? process.env.SMS_PROVIDER_URL : process.env.EMAIL_API_URL;
  const token = isSms ? process.env.SMS_PROVIDER_TOKEN : process.env.EMAIL_API_TOKEN;
  if (!url || !token) return { ok:false, configured:false, message:`${isSms?'SMS':'Email'} provider is not configured.` };
  const response = await fetch(url, { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body:JSON.stringify(payload) });
  const text = await response.text();
  return { ok:response.ok, configured:true, status:response.status, response:text.slice(0,500) };
}
module.exports = { send };
