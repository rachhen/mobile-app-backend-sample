import md5 from 'md5';
import request from '@/utils/request';
import firebase from '@/utils/firebase';

export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(
      user => {
        if (!user) return;
        const revertData = {
          name: user.displayName ? user.displayName : 'Mama',
          avatar: user.photoURL
            ? user.photoURL
            : `https://www.gravatar.com/avatar/${md5(user.email)}?s=200`,
        };
        resolve({ userid: user.uid, ...user, ...revertData });
      },
      error => reject(error),
    );
  });
  //   const res = request('/api/currentUser');
  //   console.log(await g());
  //   console.log(await res);
  //   return g();
}
export async function queryNotices() {
  return request('/api/notices');
}
