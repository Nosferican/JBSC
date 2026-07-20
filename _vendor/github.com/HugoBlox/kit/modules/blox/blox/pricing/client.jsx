import {render} from "preact";
import {PricingBlock} from "./component.jsx";

function renderPricingBlocks() {
  const blocks = document.querySelectorAll('[data-block-type="pricing"]');
  blocks.forEach((block) => {
    const propsData = block.dataset.props;
    if (propsData) {
      const props = JSON.parse(propsData);
      render(<PricingBlock {...props} />, block);
    }
  });
}

renderPricingBlocks();
