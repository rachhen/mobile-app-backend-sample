import request from '@/utils/request';
import firebase from '@/utils/firebase';

export async function fakeAccountLogin(params) {
  const user = await firebase.auth().signInWithEmailAndPassword(params.userName, params.password);

  if (!user) return { status: 'error', type: 'account', currentAuthority: 'guest' };
  // return request('/api/login/account', {
  //   method: 'POST',
  //   data: params,
  // });

  // console.log(await res);
  return { status: 'ok', type: 'account', currentAuthority: 'admin' };
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
