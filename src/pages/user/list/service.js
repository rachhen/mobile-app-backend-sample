/**
 * @author Rachhen
 * using this file for communicate with other service for user
 * like firebase
 */

import moment from 'moment';
import firebase, { db } from '@/utils/firebase';
import { dateFormat, clean } from '@/utils/localParams';

export async function queryUser(params) {
  try {
    const users = [];
    const userSnaphot = await db.collection('users').get();
    userSnaphot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });

    return { data: users, total: users.length, success: true, ...params };
  } catch (error) {
    // console.log(error);
    return { data: null, total: 0, success: false, ...params };
  }
}

export async function addUser(fields) {
  let avatar = '';
  let avatarPath = {};

  // create new field for avatar field if user upload profile
  if (fields.avatar) {
    avatarPath = {
      path: `users/${fields.avatar.file.name}`,
      size: fields.avatar.file.size,
      type: fields.avatar.file.type,
      name: fields.avatar.file.name,
    };
    avatar = fields.avatar.file.response;
  }

  // convert params to variable, bcus eslint worning
  const item = Object.assign({}, fields);

  // Reassign value
  item.avatarPath = avatarPath;
  item.avatar = avatar;
  item.dob = moment(fields.dob).format(dateFormat);
  item.createdAt = new Date();

  try {
    // create user account for firebase
    const createdUser = await firebase
      .auth()
      .createUserWithEmailAndPassword(fields.email, fields.password);

    if (createdUser) {
      createdUser.user.updateProfile({
        displayName: `${fields.firstName} ${fields.lastName}`,
        photoURL: avatar,
      });
    }

    // delete field password and confirm password, bcus we don't need to store password to firestore
    delete item.password;
    delete item.confirmPassword;

    // create user collection for firestore
    await db
      .collection('users')
      .doc(`${createdUser.user.uid}`)
      .set(item);
  } catch (error) {
    // eslint-disable-next-line no-console
    throw new Error(error);
  }
}

export const updateUser = async (fields, uid) => {
  const item = Object.assign({}, fields);

  if (fields.avatar) {
    item.avatarPath = {
      path: `users/${fields.avatar.file.name}`,
      size: fields.avatar.file.size,
      type: fields.avatar.file.type,
      name: fields.avatar.file.name,
    };
    item.avatar = fields.avatar.file.response;
  }

  item.dob = moment(fields.dob).format(dateFormat);
  item.updatedAt = new Date();

  if (fields.password) {
    fetch('https://us-central1-fir-cloud-function-fda9f.cloudfunctions.net/updateUserInfo', {
      method: 'post',
      body: JSON.stringify({
        uid,
        name: `${fields.firstName} ${fields.lastName}`,
        password: fields.password,
      }),
    })
      .then(res => res.json())
      .then(() => {
        // eslint-disable-next-line no-console
        console.log('User info updated!');
      })
      .catch(err => {
        throw new Error(err);
      });
  }

  try {
    clean(item);
    await db
      .collection('users')
      .doc(`${uid}`)
      .update(item);
  } catch (error) {
    throw new Error(error);
  }
};

// this function using for upload image to firebase storage and return promise url for user collection
export const uploadFeatureImage = file =>
  new Promise((resolve, reject) => {
    const uploadTask = firebase
      .storage()
      .ref('users')
      .child(file.name)
      .put(file);
    uploadTask.on(
      'state_changed',
      () => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        // var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
      },
      error => {
        reject(error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          resolve(downloadURL);
        });
      },
    );
  });

// this function using for delete image from firebase storage for user collection
export const deleteFeatureImage = async filename => {
  const deleted = await firebase
    .storage()
    .ref('users')
    .child(filename)
    .delete();
  return deleted;
};
