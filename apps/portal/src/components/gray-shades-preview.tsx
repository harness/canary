import * as styles from "@harnessio/core-design-system/styles-esm";

const grayShades = Object.keys(styles.colors.gray).filter((k) => k !== "$type");

export const GrayShadesPreview: React.FC = () => (
  <div className="not-content mt-3">
    <div className="flex gap-[2px] mb-1">
      {grayShades.map((shade) => (
        <div key={shade} className="flex-1 text-center">
          <span className="text-[9px] text-cn-3 font-medium">{shade}</span>
        </div>
      ))}
    </div>
    <div className="flex gap-[2px]">
      {grayShades.map((shade) => {
        const token = styles.colors.gray[shade as unknown as keyof typeof styles.colors.gray] as { $value?: string };
        const lchValue = token?.$value || "";
        
        return (
          <div
            key={shade}
            className="flex-1 h-8 rounded-[3px]"
            style={{ backgroundColor: lchValue }}
            title={`gray.${shade}: ${lchValue}`}
          />
        );
      })}
    </div>
  </div>
);
