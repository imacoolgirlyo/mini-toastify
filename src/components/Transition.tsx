import { Default } from '../utils';
import { cssTransition } from '../utils/cssTransition';

const Bounce = cssTransition({
  enter: `${Default.CSS_NAMESPACE}--animate ${Default.CSS_NAMESPACE}__bounce-enter`,
  exit: `${Default.CSS_NAMESPACE}--animate ${Default.CSS_NAMESPACE}__bounce-exit`,
  appendPosition: true,
});

export { Bounce };
