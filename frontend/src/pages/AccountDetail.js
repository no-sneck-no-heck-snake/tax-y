import React from "react";
import useFetch from "use-http";
import { Card, CardContent, Typography } from "@material-ui/core";
import { DeductionCategory } from "../components/DeductionCategory";

export function AccountDetail() {
  const { loading, error, data = { categories: [] } } = useFetch(
    "/deductions",
    { method: "GET" },
    []
  );

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom={true} variant="h6">
          Abzüge
        </Typography>
        {data.categories.map((c) => (
          <DeductionCategory category={c}></DeductionCategory>
        ))}
      </CardContent>
    </Card>
  );
}
