function getDisplayName(componentClass) {
  return componentClass.displayName || componentClass.name || 'Component';
}

function validateComponent(component) {
  if (!component.prototype.render) {
    throw new Error(getDisplayName(component) + ' is not a class-based component.');
  }

  if (!jasmine.isSpy(component.prototype.render)) {
    throw new Error(getDisplayName(component) + ' has not been spied on.');
  }
}

module.exports = {
  getDisplayName: getDisplayName,
  validateComponent: validateComponent
};
