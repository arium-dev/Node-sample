const express = require("express");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const path = require("path");
const { handle } = require("../../../utils/asyncHandler");
const { RoleRepository } = require("../../../repositories/RoleRepository");
const {
  CurrencyRepository,
} = require("../../../repositories/CurrencyRepository");
const {
  SystemPreferenceRepository,
} = require("../../../repositories/SystemPreferenceRepository");
const {
  CurrencyExchangeService,
} = require("../../../services/CurrencyExchangeService");
const {
  PermissionRepository,
} = require("../../../repositories/PermissionRepository");
const {
  RolePermissionRepository,
} = require("../../../repositories/RolePermissionRepository");
const { QueueService } = require("../../../services/QueueService");
const { createRoles } = require("../../../useCases/seeder/createRoles");
const { addCurrencies } = require("../../../useCases/seeder/addCurrencies");
const {
  addSystemPreferences,
} = require("../../../useCases/seeder/addSystemPreferences");
const { Permission } = require("../../../models/Permission");
const { RolePermission } = require("../../../models/RolePermission");
const { GenericConstants } = require("../../../constants");

const app = express.Router();

app.get(
  "/",
  handle(async (req, res) => {
    const roles = await createRoles({
      roleRepository: new RoleRepository(),
    });

    const currencies = await addCurrencies({
      currencyService: new CurrencyExchangeService(),
      currencyRepository: new CurrencyRepository(),
      queueService: new QueueService(),
    });

    const systemPreference = await addSystemPreferences({
      systemRepository: new SystemPreferenceRepository(),
    });

    res.json({ code: 200, message: "Executed" });
  })
);

app.get(
  "/read-and-save-permissions",
  handle(async (req, res) => {
    try {
      const permissionRepository = new PermissionRepository();
      const readXlsxFile = require("read-excel-file/node");
      let dirPath = path.join(
        __dirname,
        "../../../public/",
        "permissions.xlsx"
      );

      const data = await readXlsxFile(
        path.join(__dirname, "../../../public/", "permissions.xlsx")
      );

      const headings = data.shift();
      for (row of data) {
        let obj = {},
          index = 0;
        for (key of headings) {
          obj = { ...obj, [key]: row[index] };
          index++;
        }
        let permission = new Permission(obj);
        permission = await permissionRepository.save(permission);
      }

      res.json({ code: 200, message: GenericConstants.DONE, data: data });
    } catch (error) {
      res.json({ code: 400, message: GenericConstants.ERROR, error });
    }
  })
);

app.get(
  "/read-and-save-roles-permissions",
  handle(async (req, res) => {
    try {
      const roleRepository = new RoleRepository();
      const permissionRepository = new PermissionRepository();
      const rolePermissionRepository = new RolePermissionRepository();
      const readXlsxFile = require("read-excel-file/node");
      const data = await readXlsxFile(
        path.join(__dirname, "../../../public/", "rolespermissions.xlsx")
      );
      const headings = data.shift();
      for (row of data) {
        let obj = {},
          index = 0;
        for (key of headings) {
          obj = { ...obj, [key]: row[index] };
          index++;
        }

        const role = await roleRepository.findOne({ name: obj.role });
        const permission = await permissionRepository.findOne({
          module: obj.module,
          action: obj.action,
        });

        let rp = {
          roleId: new ObjectId(role.id),
          permissionId: new ObjectId(permission.id),
        };

        rp = new RolePermission(rp);
        rp = await rolePermissionRepository.save(rp);
      }

      res.json({ code: 200, message: GenericConstants.DONE, data: data });
    } catch (error) {
      res.json({ code: 400, message: GenericConstants.ERROR, error });
    }
  })
);

module.exports = app;
