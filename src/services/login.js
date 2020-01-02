import request from '@/utils/request';

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

// import firebase from '@/utils/firebase';

// export const accountLogin = async data => {
//   const { email, password } = data;
//   const user = await firebase.auth().signInWithEmailAndPassword(email, password);
//   return user;
// };
