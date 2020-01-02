/**
 * request network request tool
 * More detailed api documentation: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';

const codeMessage = {
  200: 'The server successfully returned the requested data.',
  201: 'New or modified data was successful.',
  202: 'A request has been queued in the background (asynchronous task).',
  204: 'Data deleted successfully.',
  400: 'There was an error in the request, and the server did not create or modify data.',
  401: 'The user does not have permissions (token, username, password error).',
  403: 'The user is authorized, but access is prohibited.',
  404: 'The request was made for a record that does not exist, and the server did not perform an operation.',
  406: 'The requested format is not available.',
  410: 'The requested resource is permanently deleted and is no longer available.',
  422: 'When creating an object, a validation error occurred.',
  500: 'A server error occurred. Please check the server.',
  502: 'Gateway error.',
  503: 'Services are unavailable and the server is temporarily overloaded or maintained.',
  504: 'Gateway timed out.',
};
/**
 * Exception handler
 */

const errorHandler = error => {
  const { response } = error;

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `Request error ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: 'Your network is abnormal and cannot connect to the server',
      message: 'network anomaly',
    });
  }

  return response;
};
/**
 * Configure default parameters for request
 */

const request = extend({
  errorHandler,
  // Default error handling
  credentials: 'include', // Whether to bring cookies by default
});
export default request;
