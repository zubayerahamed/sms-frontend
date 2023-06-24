package com.asl.fe.service.impl;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import org.apache.catalina.Wrapper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;
import org.springframework.web.client.RestTemplate;

import com.asl.fe.enums.ContactImportExportColumns;
import com.asl.fe.interceptor.RestTemplateInterceptor;
import com.asl.fe.model.AsyncCSVResult;
import com.asl.fe.model.ContactResDTO;
import com.asl.fe.model.ImportExportPage;
import com.asl.fe.model.Response;

import lombok.extern.slf4j.Slf4j;

/**
 * @author Zubayer Ahamed
 * @data Jun 23, 2023
 */
@Slf4j
@Service("contactimportexportService")
public class ContactImportExportImpl extends AbstractImportExport {
	private static final String MODULE_NAME = "contactimportexport";
	private static final String EXPORT_FILE_NAME = "contact";

	@Override
	public String showExportImportPage(Model model) {
		log.debug("Load Contact export/import module");
		model.addAttribute("module", getnerateExportImportPageData());
		return IMPORT_EXPORT_PATH;
	}
	
	private ImportExportPage getnerateExportImportPageData() {
		ImportExportPage eip = new ImportExportPage();
		eip.setModuleName(MODULE_NAME);
		eip.setPageTitle("Contact Import/Export");
		eip.setModuleColumns(getModuleColumns(ContactImportExportColumns.class));
		eip.setShowExportTab(true);
		eip.setExportTabPrompt("Export");
		eip.setShowImportTab(true);
		eip.setImportTabPrompt("Import");
		eip.setShowFileDelimiter(true);
		eip.setShowIgnoreFirstRow(true);
		eip.setShowUpdateExistingRecord(true);
		eip.setUpdateExistingRecordPrompt("Update existing record? :");
		eip.setShowNotes(true);
		List<String> notes = new ArrayList<>();
		notes.add("You must select \"update existing record?\" to update existing system record");
		eip.setNotes(notes);

		return eip;
	}

	@Override
	public void downloadTemplate(AsyncCSVResult asyncCSVResult) throws IOException {
		HttpServletResponse response = asyncCSVResult.getHttpServletResponse();
		ServletOutputStream out = response.getOutputStream();
		response.setContentType("text/csv;charset=UTF-8");
		String fileName = "contact-template.csv";
		response.addHeader("content-disposition", "attachment; filename=\"" + fileName +"\"");

		// Print header
		out.println(getHeader());
		out.flush();

		response.flushBuffer();
		response.getOutputStream().close();
	}

	@Override
	public void retreiveData(AsyncCSVResult asyncCSVResult) throws IOException {
		String fileType = "csv";
		String fileName = getFileName(EXPORT_FILE_NAME, fileType);

		String tempoFileName = getResult(fileName, asyncCSVResult);

		asyncCSVResult.setFileName(fileName);
		asyncCSVResult.setMimeType(new MediaType("text", fileType));
		asyncCSVResult.setDataFileName(tempoFileName);
	}

	private String getResult(String fileName, AsyncCSVResult asyncCSVResult) {
		String headerLines = getHeader() + LINE_BREAK;
		String tempPath = appConfig.getAppTempDir();
		String fileNameWithDirectory = tempPath + File.separator + fileName;

		// Create temp path if not exist
		File f = new File(tempPath);
		if(!f.exists()) f.mkdir();

		try (FileWriter fw = new FileWriter(fileNameWithDirectory); 
			BufferedWriter bw = new BufferedWriter(fw)) {
			bw.write(headerLines);
		} catch (IOException e) {
			log.error("Can not write file {}: {}", fileNameWithDirectory, e);
			return null;
		}

		long totalSize = 0;
		long chunkLimit = CHUNK_LIMIT;
		long offset = 0;
		long dataSize = 1;

		while(dataSize > 0) {
			List<String[]> fileLineData = new ArrayList<>();

			RestTemplate restTemplate = new RestTemplate();

			List<ClientHttpRequestInterceptor> interceptors = restTemplate.getInterceptors();
			interceptors.add(new RestTemplateInterceptor(asyncCSVResult.getAuthToken()));
			restTemplate.setInterceptors(interceptors);

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);

			Response<ContactResDTO> response = restTemplate.exchange(asyncCSVResult.getApiBaseUrl() + "/contact/chunkable?limit=" + chunkLimit + "&offset=" + offset,
					HttpMethod.GET, null, new ParameterizedTypeReference<Response<ContactResDTO>>() {
					}).getBody();

			List<ContactResDTO> result = response.getItems();

			// xtrnService.getExportDataByChunk(chunkLimit, offset + 1, asyncCSVResult.getBusinessId());
			dataSize = result.size();

			offset = offset + dataSize;

			createFileLineDataFromResult(fileLineData, result);

			StringBuilder dataLines = new StringBuilder();
			fileLineData.forEach(ln -> {
				if (ln != null) {
					dataLines.append(String.join(",", ln)).append(LINE_BREAK);
				}
			});

			try (FileWriter fw = new FileWriter(fileNameWithDirectory, true); 
					BufferedWriter bw = new BufferedWriter(fw)) {
				bw.append(dataLines.toString());
			} catch (IOException e) {
				log.error(ERROR, e.getMessage(), e);
			}

			totalSize = totalSize + dataSize;
			if(dataSize < chunkLimit) {
				break; 
			}
		}

		log.debug("Total size: {}", totalSize);
		return fileNameWithDirectory;
	}

	private void createFileLineDataFromResult(List<String[]> fileLineData, List<ContactResDTO> result) {
		for(ContactResDTO row : result) {
			String name = modifiedValue(row.getName());
			String mobile = modifiedValue(row.getMobile());
			String email = modifiedValue(row.getEmail());
			if(StringUtils.isBlank(name) || StringUtils.isBlank(mobile)) continue;

			String[] dataLine = new String[3];
			dataLine[0] = name;
			dataLine[1] = mobile;
			dataLine[2] = email;
			fileLineData.add(dataLine);
		}
	}

	@Override
	public void processCSV(AsyncCSVResult asyncCSVResult) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void importCSV(AsyncCSVResult asyncCSVResult) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public String getHeader() {
		return getHeader(ContactImportExportColumns.class);
	}

	
}
