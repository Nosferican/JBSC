import {render} from "preact";
import {ComparisonTableBlock} from "./component.jsx";

function renderComparisonTableBlocks() {
  const blocks = document.querySelectorAll('[data-block-type="comparison-table"]');
  blocks.forEach((block) => {
    const propsData = block.dataset.props;
    if (propsData) {
      const props = JSON.parse(propsData);
      render(<ComparisonTableBlock {...props} />, block);
    }
  });
}

renderComparisonTableBlocks();
