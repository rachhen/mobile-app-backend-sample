import React from 'react';
import Redirect from 'umi/redirect';
import { connect } from 'dva';
import Authorized from '@/utils/Authorized';
import { getAuthority } from '@/utils/authority';
import { getRouteAuthority } from '@/utils/utils';

const AuthComponent = ({ children, route, location }) => {
  // const { currentUser } = user;
  const { routes = [] } = route;
  const auth = getAuthority();
  const isLogin = auth && auth[0] !== 'guest';

  return (
    <Authorized
      authority={getRouteAuthority(location.pathname, routes) || ''}
      noMatch={isLogin ? <Redirect to="/exception/403" /> : <Redirect to="/user/login" />}
    >
      {children}
    </Authorized>
  );
};

export default connect(({ user }) => ({
  user,
}))(AuthComponent);
