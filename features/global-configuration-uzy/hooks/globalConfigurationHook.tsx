import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getGlobalConfigurationById } from "@/features/global-configuration-uzy/services/globalConfigService";

export const useGlobalConfig = (id: number) => {
  const query = useQuery({
    queryKey: ["global-configuration", id],
    queryFn: () => getGlobalConfigurationById(id),
    enabled: !!id, // Hanya jalan jika ID tersedia
  });

  // Side effect untuk menyimpan ke localStorage saat data berhasil di-fetch
  useEffect(() => {
    if (query.data?.data?.gconfValue) {
      const value = query.data.data.gconfValue;
      localStorage.setItem("gconfValue", value);
      console.log("Saved to localStorage:", value);
    }
  }, [query.data]);

  return query;
};