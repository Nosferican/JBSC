import {render} from "preact";
import {StepsBlock} from "./component.jsx";

function renderStepsBlocks() {
  const blocks = document.querySelectorAll('[data-block-type="steps"]');
  blocks.forEach((block) => {
    const propsData = block.dataset.props;
    if (propsData) {
      const props = JSON.parse(propsData);
      render(<StepsBlock {...props} />, block);
    }
  });
}

renderStepsBlocks();
