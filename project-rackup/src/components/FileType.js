import React from "react";
import {AiFillFileZip} from "react-icons/ai";
import {AiFillFileText} from "react-icons/ai";
import {FaFileImage} from "react-icons/fa";
import {FaFileExcel} from "react-icons/fa";
import {FaFileWord} from "react-icons/fa";
import {FaFilePowerpoint} from "react-icons/fa";
import {FaFile} from "react-icons/fa";
import {FaFilePdf} from "react-icons/fa";
import {VscLink} from "react-icons/vsc";

import './FileType.css';

export const FileType = {
    zip: <AiFillFileZip className="filetype-icon"/>,
    png: <FaFileImage className="filetype-icon"/>,
    jpg: <FaFileImage className="filetype-icon"/>,
    jpeg: <FaFileImage className="filetype-icon"/>,
    xml: <FaFileExcel className="filetype-icon"/>,
    doc: <FaFileWord className="filetype-icon"/>,
    docx: <FaFileWord className="filetype-icon"/>,
    txt: <AiFillFileText className="filetype-icon"/>,
    pdf: <FaFilePdf className="filetype-icon"/>,
    ppt: <FaFilePowerpoint className="filetype-icon"/>,
    pptx: <FaFilePowerpoint className="filetype-icon"/>,
    default: <FaFile className="filetype-icon"/>,
    link: <VscLink className="filetype-icon"/>
}