import React from "react";
import { useParams } from "react-router-dom";
import BacteriaPage from "./BacteriaPage";
import bacteriaList from "./bacteriaData";

const BacteriaRouter: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const bacteria = bacteriaList.find((b) => b.id === id);
  if (!bacteria) return <div>Bacteria not found</div>;
  return <BacteriaPage bacteria={bacteria} />;
};

export default BacteriaRouter;
