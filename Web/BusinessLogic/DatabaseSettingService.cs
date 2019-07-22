using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Web.Models;
using WebApplication;

namespace Web.Services
{
    public class DatabaseSettingService
    {
        private DatabaseContext _context;

        public DatabaseSettingService(DatabaseContext context)
        {
            this._context = context;
        }

        public string GetSettingValue(string settingId)
        {
            var databaseSetting = this._context.DatabaseSettings.SingleOrDefault(ds => ds.SettingId == settingId);
            if (databaseSetting == null)
            {
                throw new Exception($"Could not find settingValue for settingId {settingId}");
            }

            return databaseSetting.SettingValue;
        }

        public IEnumerable<DatabaseSetting> GetDatabaseSettings()
        {
            return this._context.DatabaseSettings.ToList();
        }
    }
}