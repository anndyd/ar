package com.sap.sf.ar.util;

import java.sql.Date;
import java.time.LocalDateTime;
import java.time.ZoneId;

public class Utils {
	private static String p = "^.+\\.(?i)(";
	
	public static boolean isExcel2003(String filePath)  {  
         return filePath.matches(p + "xls)$");  
    }  
   
    public static boolean isExcel2007(String filePath)  {  
         return filePath.matches(p + "xlsx)$");  
    } 
    
    public static Date minusDays(Date d, long days) {
    	LocalDateTime ld = LocalDateTime.ofInstant(d.toInstant(), ZoneId.systemDefault());
    	ld.minusDays(days);
    	return (Date) Date.from(ld.atZone(ZoneId.systemDefault()).toInstant());
    }
    
    public static String getSqlInString(Object[] a) {
        if (a == null)
            return "";

        int iMax = a.length - 1;
        if (iMax == -1)
            return "";

        StringBuilder b = new StringBuilder();
        b.append("'");
        for (int i = 0; ; i++) {
            b.append(String.valueOf(a[i]));
            if (i == iMax)
                return b.append("'").toString();
            b.append("','");
        }
    }
}
