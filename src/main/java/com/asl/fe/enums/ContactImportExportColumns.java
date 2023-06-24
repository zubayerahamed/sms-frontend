package com.asl.fe.enums;

import com.asl.fe.service.GenericImportExportColumns;

public enum ContactImportExportColumns implements GenericImportExportColumns {
	CONTACT_NAME(1, "Contact Name", "Column A", ImportExportColumnType.REQUIRED, "Contact Name"),
	MOBILE(2, "Mobile Number", "Column B", ImportExportColumnType.REQUIRED, "Mobile Number"),
	EMAIL(3, "Email", "Column C", ImportExportColumnType.OPTIONAL, "Email Address");

	private int columnIndex;
	private String columnName;
	private String column;
	private ImportExportColumnType iect;
	private String columnDescription;

	private ContactImportExportColumns(int position, String code, String column, ImportExportColumnType iect, String description) {
		this.columnIndex = position;
		this.columnName = code;
		this.column = column;
		this.iect = iect;
		this.columnDescription = description;
	}

	@Override
	public int getColumnIndex() {
		return columnIndex;
	}

	@Override
	public String getColumnName() {
		return columnName;
	}

	@Override
	public String getColumn() {
		return column;
	}

	@Override
	public ImportExportColumnType getIect() {
		return iect;
	}

	@Override
	public String getColumnDescription() {
		return columnDescription;
	}

}
