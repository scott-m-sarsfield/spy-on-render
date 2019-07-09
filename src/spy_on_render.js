const {getDisplayName, validateComponent} = require('./validate_component');

const REACT_LIFECYCLE_METHODS = [
  'componentWillMount',
  'componentDidMount',
  'componentWillReceiveProps',
  'componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount'
];

module.exports = {
  spyOnRender(componentClass) {
    if (!componentClass.prototype.render) {
      throw new Error('<spyOnRender> : ' + getDisplayName(componentClass) + ' is not a class-based component.');
    }

    REACT_LIFECYCLE_METHODS.forEach((methodName) => {
      if(componentClass.prototype[methodName]) {
        spyOn(componentClass.prototype, methodName)
      }
    });

    return spyOn(componentClass.prototype, 'render').and.returnValue(null);
  },
  customMatchers: {
    toHaveBeenRenderedWithProps(util, customEqualityTesters) {
      return {
        compare: function compare(actual, expected) {
          let result = {};

          let displayClass = getDisplayName(actual);

          try {
            validateComponent(actual);
          } catch (err) {
            result.pass = false;
            result.message = err.message;
            return result;
          }

          let propsByRender = actual.prototype.render.calls.all().map(function(_ref) {
            let props = _ref.object.props;
            return props;
          });

          let matchingProps = propsByRender.find(function(props) {
            return util.equals(props, expected, customEqualityTesters);
          });

          let displayExpected = jasmine.pp(expected);

          if (matchingProps) {
            result.pass = true;
            result.message = 'Expected ' + displayClass + ' not to have been rendered with props ' + displayExpected;
          } else {
            result.pass = false;
            let displayActual = jasmine.pp(propsByRender);

            result.message = 'Expected ' + displayClass + ' to have been rendered with props ' + displayExpected + ', but got ' + displayActual;
          }

          return result;
        }
      };
    },
    toHaveBeenRendered() {
      return {
        compare: function compare(actual) {
          let result = {};

          let displayClass = getDisplayName(actual);

          try {
            validateComponent(actual);
          } catch (err) {
            result.pass = false;
            result.message = err.message;
            return result;
          }

          let mostRecentCall = actual.prototype.render.calls.mostRecent();

          if (mostRecentCall) {
            result.pass = true;
            result.message = 'Expected ' + displayClass + ' not to have been rendered';
          } else {
            result.pass = false;
            result.message = 'Expected ' + displayClass + ' to have been rendered';
          }

          return result;
        }
      }
    }
  }
};
