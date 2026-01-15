export const TX_META = {
  issue: {
    color: "danger",
    icon: "bi-arrow-up-right",
    badge: "bg-danger",
  },
  receipt: {
    color: "success",
    icon: "bi-arrow-down-left",
    badge: "bg-success",
  },
  adjustment: {
    color: "warning",
    icon: "bi-arrow-left-right",
    badge: "bg-warning text-dark",
  },
};

export const calculateClosing = (type, opening, qty) => {
  if (type === "issue") return opening + qty;
  return opening - qty;
};
