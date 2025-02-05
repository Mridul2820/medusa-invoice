import { Container } from "@medusajs/ui";
import { useState } from "react";
import { Grid } from "@mui/material";
import OrderTable from "../orders/order-table";

export const OrdersTab = () => {
  const [contextFilters, setContextFilters] =
    useState<Record<string, { filter: string[] }>>();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12} xl={12}>
        <Container>
          <OrderTable setContextFilters={setContextFilters} />
        </Container>
      </Grid>
    </Grid>
  );
};
