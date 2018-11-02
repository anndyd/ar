package com.sap.sf.ar.service;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.mail.Address;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.util.ByteArrayDataSource;

import org.apache.log4j.Logger;

import com.sap.sf.ar.dto.MailContent;
import com.sap.sf.ar.entity.OncallAllowance;

public class SendMail {
	private static final Logger LOGGER = Logger.getLogger(SendMail.class);
	private static String templatePath = "C:/template/";
	
    public void sendNoticeEmail(MailContent info, List<String> cc, List<String> admins, String fileName) {
        String sender = "system@exchange.sap.corp";
        String receiver = "%s@exchange.sap.corp";
        Properties props = new Properties();
        props.put("mail.smtp.host", "mail.sap.corp");
        Session session = Session.getInstance(props, null);
        try {
            String recId = info.getReceiver();
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(sender));
      
            List<InternetAddress> adminAddr = new ArrayList<>();
            if (admins != null && admins.size() > 0) {
                admins.forEach(itm->{
                    try {
                        if (!"".equals(itm)) {
                            adminAddr.add(new InternetAddress(String.format(Locale.ENGLISH, receiver, itm)));
                        }
                    } catch (AddressException e) {
                        e.printStackTrace();
                    }
                });
                message.setRecipients(Message.RecipientType.BCC, adminAddr.toArray(new Address[adminAddr.size()]));
            }
            List<InternetAddress> toAddr = new ArrayList<>();
            toAddr.add(new InternetAddress(String.format(Locale.ENGLISH, receiver, info.getReceiver())));
            message.setRecipients(Message.RecipientType.TO, toAddr.toArray(new Address[toAddr.size()]));
            
            List<InternetAddress> ccAddr = new ArrayList<>();
            if (cc != null && cc.size() > 0) {
                cc.forEach(itm->{
                    try {
                        if (!"".equals(itm)) {
                            ccAddr.add(new InternetAddress(String.format(Locale.ENGLISH, receiver, itm)));
                        }
                    } catch (AddressException e) {
                        e.printStackTrace();
                    }
                });
            }
            if (ccAddr.size() > 0) {
                message.setRecipients(Message.RecipientType.CC, ccAddr.toArray(new Address[ccAddr.size()]));
            }
            message.setSubject("On call allowance request notification");
            
            String content = generateMailContent(info, fileName);
            content = content.replace("@logopath", "cid:sap-logo");
            if (null != info.getItems() && info.getItems().size() > 0) {
                content = content.replaceAll("@empName", info.getItems().get(0).getEmpName());
            }
            content = content.replaceAll("@approver", info.getApprover());
            content = content.replaceAll("@link", info.getLink());
            content = content.replaceAll("@reason", info.getReason());
            
            Multipart parts = new MimeMultipart();
            parts.addBodyPart(createImagePart(this.getClass().getClassLoader().getResourceAsStream("META-INF/logo.jpg"), "<sap-logo>"));
            handleImage(parts, content);
            
            message.setContent(parts);
            Transport.send(message);
            LOGGER.info("----Mail sent.----");
        } catch (Exception e) {
            LOGGER.error("----Send mail failed.---- Employee: " + info.getReceiver() + ", message: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private BodyPart createImagePart(InputStream is, String partName) throws Exception {
        BodyPart imagePart = new MimeBodyPart();
        DataSource ds = new ByteArrayDataSource(is, "image/jpeg");
        imagePart.setDataHandler(new DataHandler(ds));
        imagePart.setHeader("Content-ID", partName);
        
        return imagePart;
    }
    
    private void handleImage(Multipart parts, String content) throws Exception {
		Pattern pImageFilename = Pattern.compile("image[0-9]*\\.(jpg|png|gif)");
		Pattern pattern = Pattern.compile("(?<=\")[^\"]*image[0-9]*\\.(jpg|png|gif)(?=\")");
		Matcher matcher = pattern.matcher(content);
		StringBuffer sbr = new StringBuffer();
		while (matcher.find()) {
			String m = matcher.group();
			Matcher mF = pImageFilename.matcher(m);
			if (mF.find()) {
				String imageFilename = mF.group();
				
				try {
					parts.addBodyPart(createImagePart(new FileInputStream(templatePath + "/image/" + imageFilename), "<" + imageFilename + ">"));
				} catch (Exception e) {
					LOGGER.info("Add image file fail: " + imageFilename);
				}
			    matcher.appendReplacement(sbr, "cid:" + imageFilename);
			}
		}
		matcher.appendTail(sbr);
		content = sbr.toString();
        MimeBodyPart part = new MimeBodyPart();
        part.setText(content, "GBK");
        part.setContent(content, "text/html;charset=GBK");
        parts.addBodyPart(part);
    }
    
    private String generateMailContent(MailContent info, String fileName) throws Exception {
        String content = "";
        BufferedReader reader = null;
        StringBuilder builder;
        List<OncallAllowance> infoItems = info.getItems();
        templatePath = this.getClass().getResource("/").getPath();
        String fullFileName = templatePath + fileName;
        reader = new BufferedReader(new FileReader(fullFileName));
        builder = new StringBuilder();
        StringBuilder header = new StringBuilder();
        StringBuilder tableLine = new StringBuilder();
        boolean isLineStart = false;
        boolean isLine = false;
        boolean isLineEnd = false;
        StringBuilder ender = new StringBuilder();
        String line = reader.readLine();
        while (line != null) {
            if (!isLine && line.contains("<tr>")) {
                tableLine = new StringBuilder();
                isLineStart = true;
            } else if (line.contains("@iNumber")) {
                isLine = true;
            }
            if (isLine && !isLineEnd && line.contains("</tr>")) {
                isLineEnd = true;
            }
            if (isLineStart) {
                tableLine.append(line);
            }
            if (isLineEnd && !isLineStart) {
                ender.append(line);
            } else {
                header.append(line);
            }
            if (isLineEnd) {
                isLineStart = false;
            }
            line = reader.readLine();
        }
        reader.close();
        String lineContent = header.toString();
        for (int i=0; i<infoItems.size(); i++) {
            if (i>0) {
                lineContent = tableLine.toString();
            }
            lineContent = lineContent.replaceAll("@iNumber", infoItems.get(i).getiNumber());
            lineContent = lineContent.replaceAll("@empName", infoItems.get(i).getEmpName());
            builder.append(lineContent);
        }
        builder.append(ender);
        content = builder.toString();

        return content;
    }

}
