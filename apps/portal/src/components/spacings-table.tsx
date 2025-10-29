const spacings = {
  0: "0px",
  px: "1px",
  "4xs": "2px",
  "3xs": "4px",
  "2xs": "6px",
  xs: "8px",
  sm: "12px",
  md: "16px",
  lg: "24px",
  xl: "28px",
  "2xl": "32px",
  "3xl": "40px",
  "4xl": "80px",
  auto: "auto",
  full: "100%",
};

const SpacingsTable = () => (
  <table>
    <thead>
      <tr>
        <th className="w-12">Name</th>
        <th className="w-12">Value</th>
        <th className="w-full"></th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(spacings).map(([key, value]) => (
        <tr key={key}>
          <td>{key}</td>
          <td>{value}</td>
          <td>
            <div
              className="bg-cn-brand-secondary rounded"
              style={{ width: value, height: "24px" }}
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default SpacingsTable;
