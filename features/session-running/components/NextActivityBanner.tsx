export default function NextActivityBanner() {
  return (
    <div
      style={{
        border: "1px solid #E2E4E6",
        borderRadius: "16px",
        padding: "15px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#FAFAFA"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              background: "#E3F2FD",
              color: "#0076D2",
              fontSize: "10px",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Next Activity
          </span>

          <span
            style={{
              color: "#0076D2",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Time Remaining: 05:30
          </span>
        </div>

        <div
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#212121",
          }}
        >
          09:20 - BLOOD_DRAW (Blood draw T-30 @ minute 60)
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "150px",
        }}
      >
        <div
          style={{
            textAlign: "left",
            borderLeft: "1px solid #E2E4E6",
            paddingLeft: "24px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#707784",
              fontWeight: 500,
              textTransform: "uppercase",
              marginBottom: "4px",
              letterSpacing: "-0.2px",
            }}
          >
            Glucose
          </div>

          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#212121",
            }}
          >
            95.0
          </div>
        </div>

        <div
          style={{
            textAlign: "left",
            paddingRight: "50px",
            borderLeft: "1px solid #E2E4E6",
            paddingLeft: "24px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#707784",
              fontWeight: 500,
              textTransform: "uppercase",
              marginBottom: "4px",
              letterSpacing: "-0.2px",
            }}
          >
            Infusion Rate
          </div>

          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#212121",
            }}
          >
            2.0
          </div>
        </div>
      </div>
    </div>
  );
}