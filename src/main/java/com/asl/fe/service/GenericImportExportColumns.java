package com.asl.fe.service;

import com.asl.fe.enums.ImportExportColumnType;

/**
 * @author Zubayer Ahamed
 *
 */
public interface GenericImportExportColumns {

	public int getColumnIndex();
	public String getColumnName();
	public String getColumn();
	public ImportExportColumnType getIect();
	public String getColumnDescription();
}
