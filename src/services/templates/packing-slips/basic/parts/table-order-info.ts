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

function generateTableRow(
  doc,
  y,
  orderNumber,
  orderDate,
  shippingMethod,
) {
  doc
    .fontSize(10)
    .text(orderNumber, 50, y)
    .text(orderDate, 300, y)
    .text(shippingMethod, 0, y, { align: "right" });
}

export function generateOrderInfoTable(doc, y, order: Order, items: LineItem[]) : number {
  let i;
  const invoiceTableTop = y + 35;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Order #",
    "Order date",
    "Shipping method",
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  const position = invoiceTableTop + 30;

  generateTableRow(
    doc,
    position,
    order.id,
    order.created_at.toLocaleDateString(),
    order.shipping_methods[0].shipping_option.name
  );

  generateHr(doc, position + 20);

  return position + 20;
}