import {render} from "preact";
import {FaqBlock} from "./component.jsx";

function renderFaqBlocks() {
  const blocks = document.querySelectorAll('[data-block-type="faq"]');
  blocks.forEach((block) => {
    const propsData = block.dataset.props;
    if (propsData) {
      const props = JSON.parse(propsData);
      render(<FaqBlock {...props} />, block);
    }
  });
}

renderFaqBlocks();
