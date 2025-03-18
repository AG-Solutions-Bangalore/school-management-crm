import { Box } from "@mui/material";

export const Upgrade = ({ isCollapsed }) => {
  return (
    <>
      {!isCollapsed ? (
        <Box display={"flex"} alignItems="center" gap={2} sx={{ m: 3 }}>
          <>
            <h2 className="text-xs  text-gray-600 border-b-2 border-dashed border-black">
              Updated On: 18-03-2025
            </h2>
          </>
        </Box>
      ) : (
        ""
      )}
    </>
  );
};
