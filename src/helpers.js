const {validateComponent} = require('./validate_component');

module.exports = {
  propsOnLastRender(componentClass) {
    validateComponent(componentClass);
    return componentClass.prototype.render.calls.mostRecent().object.props;
  },
  propsOnRenderAt(componentClass, i) {
    validateComponent(componentClass);
    return componentClass.prototype.render.calls.all()[i].object.props;
  }
};
