const db = require("../config/db");

exports.getLocationId = async (location_name) => {
  const [rows] = await db.query(
    "SELECT location_id FROM location WHERE location_name = ?",
    [location_name]
  );
  return rows.length ? rows[0].location_id : null;
};

exports.generateNewLocationId = async () => {
  const [rows] = await db.query(
    "SELECT MAX(location_id) AS lastId FROM location"
  );
  if (rows[0].lastId) {
    let lastNum = parseInt(rows[0].lastId.replace("LO", "")) + 1;
    return `LO${String(lastNum).padStart(3, "0")}`;
  }
  return "LO001";
};

exports.insertLocation = async (location_id, location_name) => {
  await db.query(
    "INSERT INTO location (location_id, location_name) VALUES (?, ?)",
    [location_id, location_name]
  );
};

exports.generateNewCompanyId = async () => {
  const [rows] = await db.query(
    "SELECT MAX(company_id) AS lastId FROM company"
  );
  if (rows[0].lastId) {
    let lastNum = parseInt(rows[0].lastId.replace("CO", "")) + 1;
    return `CO${String(lastNum).padStart(3, "0")}`;
  }
  return "CO001";
};

exports.insertCompany = async (
  company_id,
  company_name,
  address,
  gst_number,
  vendor_code,
  city_id,
  state_id,
  pincode,
  spoc_name,
  spoc_contact_no
) => {
  await db.query(
    "INSERT INTO company (company_id, company_name, address, gst_number, vendor_code, city_id, state_id, pincode, spoc_name, spoc_contact_no, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
    [company_id, company_name, address, gst_number, vendor_code, city_id, state_id, pincode, spoc_name, spoc_contact_no]
  );
};

exports.getStates = async () => {
  const [rows] = await db.query("SELECT * FROM `state`");
  return rows;
};

exports.getCities = async () => {
  const [rows] = await db.query("SELECT * FROM city");
  return rows;
};

exports.addState = async (state_name) => {
  const [result] = await db.query("INSERT INTO `state` (state_name) VALUES (?)", [state_name]);
  return result.insertId;
};

exports.addCity = async (city_name) => {
  const [result] = await db.query("INSERT INTO city (city_name) VALUES (?)", [city_name]);
  return result.insertId;
};
exports.fetchCompanyById = async (company_id) => {
  const [rows] = await db.query(
    `
        SELECT c.company_id, c.company_name, c.address, c.spoc_name, c.spoc_contact_no 
        FROM company c
        WHERE c.company_id = ?
    `,
    [company_id]
  );
  return rows.length ? rows[0] : null;
};
exports.fetchAllCompanies = async () => {
  const [rows] = await db.query(`
        SELECT 
          c.company_id,
          c.company_name,
          c.address,
          c.spoc_name,
          c.spoc_contact_no,
          c.gst_number,
          c.vendor_code,
          c.city_id,
          city.city_name,
          c.state_id,
          state.state_name,
          c.pincode,
          c.created_at,
          c.updated_at
        FROM company c
        LEFT JOIN city ON c.city_id = city.id
        LEFT JOIN state ON c.state_id = state.id
    `);
  return rows;
};

exports.fetchProjectsByCompanyId = async (company_id) => {
  const [rows] = await db.query(
    `
        SELECT pd_id, project_name
        FROM project_details
        WHERE company_id = ?
        ORDER BY project_name
    `,
    [company_id]
  );
  return rows;
};

exports.updateCompany = async (
  company_id,
  company_name,
  address,
  location_id,
  spoc_name,
  spoc_contact_no
) => {
  await db.query(
    "UPDATE company SET company_name = ?, address = ?, location_id = ?, spoc_name = ?, spoc_contact_no = ? WHERE company_id = ?",
    [company_name, address, location_id, spoc_name, spoc_contact_no, company_id]
  );
};

exports.getProjectTypeId = async (project_type) => {
  const [rows] = await db.query(
    "SELECT type_id FROM project_type WHERE LOWER(type_description) = ?",
    [project_type.toLowerCase()]
  );
  return rows.length ? rows[0].type_id : null;
};

exports.getCompanyId = async (company_name) => {
  const [rows] = await db.query(
    "SELECT company_id FROM company WHERE LOWER(company_name) = ?",
    [company_name.toLowerCase()]
  );
  return rows.length ? rows[0].company_id : null;
};

exports.generateNewProjectId = async () => {
  const [rows] = await db.query(
    "SELECT MAX(pd_id) AS lastId FROM project_details"
  );
  if (rows[0].lastId) {
    let lastNum = parseInt(rows[0].lastId.replace("PD", "")) + 1;
    return `PD${String(lastNum).padStart(3, "0")}`;
  }
  return "PD001";
};

exports.insertProject = async (
  project_id,
  project_type_id,
  company_id,
  project_name
) => {
  await db.query(
    "INSERT INTO project_details (pd_id, project_type_id, company_id, project_name) VALUES (?, ?, ?, ?)",
    [project_id, project_type_id, company_id, project_name]
  );
};

exports.getInchargeId = async (incharge_type) => {
  const [rows] = await db.query(
    "SELECT incharge_id FROM site_incharge WHERE incharge_type = ?",
    [incharge_type]
  );
  return rows.length ? rows[0].incharge_id : null;
};

exports.getWorkforceId = async (workforce_type) => {
  const [rows] = await db.query(
    "SELECT workforce_id FROM workforce_type WHERE workforce_type = ?",
    [workforce_type]
  );
  return rows.length ? rows[0].workforce_id : null;
};

exports.generateNewSiteId = async () => {
  const [rows] = await db.query(
    "SELECT MAX(site_id) AS lastId FROM site_details"
  );
  if (rows[0].lastId) {
    let lastNum = parseInt(rows[0].lastId.replace("ST", "")) + 1;
    return `ST${String(lastNum).padStart(3, "0")}`;
  }
  return "ST001";
};

exports.insertSite = async (
  site_id,
  site_name,
  po_number,
  start_date,
  end_date,
  incharge_id,
  workforce_id,
  pd_id,
  location_id,
  reckoner_type_id
) => {
  await db.query(
    "INSERT INTO site_details (site_id, site_name, po_number, start_date, end_date, incharge_id, workforce_id, pd_id, location_id, reckoner_type_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      site_id,
      site_name,
      po_number,
      start_date,
      end_date,
      incharge_id,
      workforce_id,
      pd_id,
      location_id,
      reckoner_type_id
    ]
  );
};

exports.getWorkforceTypes = async () => {
  const [rows] = await db.query("SELECT * FROM workforce_type");
  return rows;
};

exports.getSiteIncharges = async () => {
  const [rows] = await db.query("SELECT * FROM site_incharge");
  return rows;
};

exports.getProjectType = async () => {
  const [rows] = await db.query("SELECT * FROM project_type");
  return rows;
};

exports.getAllProjectsWithSites = async () => {
  const [rows] = await db.query(`
        SELECT 
            pd.pd_id AS project_id,
            pd.project_name,
            pt.type_description AS project_type,
            c.company_name,
            c.company_id,
            sd.site_id,
            sd.site_name,
            sd.po_number,
            sd.start_date,
            sd.end_date,
            si.incharge_type,
            l.location_name
        FROM 
            project_details pd
        JOIN 
            company c ON pd.company_id = c.company_id
        JOIN 
            project_type pt ON pd.project_type_id = pt.type_id
        LEFT JOIN 
            site_details sd ON pd.pd_id = sd.pd_id
        LEFT JOIN 
            site_incharge si ON sd.incharge_id = si.incharge_id
        LEFT JOIN 
            location l ON sd.location_id = l.location_id
        ORDER BY 
            pd.project_name, sd.site_name
    `);
  return rows;
};

exports.getAllProjectsWithSitesByCompanyId = async (companyId) => {
  const [rows] = await db.query(
    `
        SELECT 
            pd.pd_id AS project_id,
            pd.project_name,
            pt.type_description AS project_type,
            c.company_name,
            c.company_id,
            sd.site_id,
            sd.site_name,
            sd.po_number,
            sd.start_date,
            sd.end_date,
            si.incharge_type,
            l.location_name
        FROM 
            project_details pd
        JOIN 
            company c ON pd.company_id = c.company_id
        JOIN 
            project_type pt ON pd.project_type_id = pt.type_id
        LEFT JOIN 
            site_details sd ON pd.pd_id = sd.pd_id
        LEFT JOIN 
            site_incharge si ON sd.incharge_id = si.incharge_id
        LEFT JOIN 
            location l ON sd.location_id = l.location_id
        WHERE 
            c.company_id = ?
        ORDER BY 
            pd.project_name, sd.site_name
    `,
    [companyId]
  );
  return rows;
};

exports.getProjectByNameAndType = async (project_name, project_type_id) => {
  const [rows] = await db.query(
    "SELECT pd_id FROM project_details WHERE LOWER(project_name) = ? AND project_type_id = ?",
    [project_name.toLowerCase(), project_type_id]
  );
  return rows.length ? rows[0] : null;
};

exports.getAllLocations = async () => {
  const [rows] = await db.query(
    "SELECT location_id, location_name FROM location ORDER BY location_name"
  );
  return rows;
};

exports.getReckonerTypes = async () => {
  const [rows] = await db.query(
    "SELECT type_id, type_name FROM reckoner_types ORDER BY type_name"
  );
  return rows;
};

exports.getNextPoNumber = async (reckoner_type_id) => {
    console.log(`Fetching next PO number for reckoner_type_id: ${reckoner_type_id}`);
    const [reckonerType] = await db.query(
        "SELECT type_name FROM reckoner_types WHERE type_id = ?",
        [reckoner_type_id]
    );
    if (!reckonerType.length) {
        console.error(`No reckoner type found for type_id: ${reckoner_type_id}`);
        return null;
    }
    const type_name = reckonerType[0].type_name.toLowerCase();
    console.log(`Reckoner type_name: ${type_name}`);
    if (type_name !== 'sample' && type_name !== 'not approved') {
        console.error(`Reckoner type ${type_name} not applicable for auto-generation`);
        return null;
    }
    const prefix = type_name === 'sample' ? 'SA' : 'NA'; // SA for Sample, NA for Not Approved
    const [rows] = await db.query(
        `SELECT po_number FROM site_details 
         WHERE po_number LIKE ? 
         ORDER BY CAST(SUBSTRING(po_number, 3) AS UNSIGNED) DESC 
         LIMIT 1`,
        [`${prefix}%`]
    );
    if (!rows.length) {
        console.log(`No existing ${prefix}-prefixed PO number found, starting with ${prefix}0000000001`);
        return `${prefix}0000000001`;
    }
    const lastNumber = parseInt(rows[0].po_number.substring(2)) || 0;
    const nextPoNumber = `${prefix}${String(lastNumber + 1).padStart(10, '0')}`;
    console.log(`Generated next PO number: ${nextPoNumber}`);
    return nextPoNumber;
};

exports.createProject = async (company_id, project_name) => {
  try {
    const project_type_id = "PT001"; // Default project_type_id as specified
    const project_id = await exports.generateNewProjectId();
    
    await exports.insertProject(project_id, project_type_id, company_id, project_name);
    
    return { project_id, project_name };
  } catch (error) {
    throw new Error("Failed to create project: " + error.message);
  }
};



exports.getWorkDescriptionsBySite = async (site_id) => {
  const [rows] = await db.query(
    `
    SELECT DISTINCT wd.desc_id, wd.desc_name
    FROM po_reckoner pr
    JOIN work_descriptions wd ON pr.desc_id = wd.desc_id
    WHERE pr.site_id = ?
    ORDER BY wd.desc_name
    `,
    [site_id]
  );
  return rows;
};