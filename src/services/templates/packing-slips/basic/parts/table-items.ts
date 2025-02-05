/*
 * Copyright 2024 RSC-Labs, https://rsoftcon.com/
 *
 * MIT License
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { LineItem, Order } from "@medusajs/medusa";
import { generateHr } from "./hr";
import { t } from "i18next";

function generateTableRow(doc, y, item, description, quantity) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 200, y)
    .text(quantity, 0, y, { align: "right" });
}

export function generateItemsTable(doc, y, order: Order, items: LineItem[]) {
  let i;
  const invoiceTableTop = y + 35;

  let totalQuantity = 0;

  generateTableRow(
    doc,
    invoiceTableTop,
    t("packing-slip-table-header-item", "Item"),
    t("packing-slip-table-header-description", "Description"),
    t("packing-slip-table-header-quantity", "Quantity")
  );
  generateHr(doc, invoiceTableTop + 20);

  for (i = 0; i < items.length; i++) {
    const item = items[i];
    totalQuantity += item.quantity;
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.title,
      item.description,
      item.quantity
    );

    generateHr(doc, position + 20);
  }

  const totalQuantityPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    totalQuantityPosition,
    "",
    t("packing-slip-table-header-total", "Total"),
    totalQuantity
  );
}
