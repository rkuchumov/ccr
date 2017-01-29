import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from '../imports/startup/client/routes.js';

import '../imports/ui/uikit/uikit.theme.less';

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('render-target'));
});
