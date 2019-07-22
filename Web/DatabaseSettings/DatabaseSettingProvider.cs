using System;
using System.Collections.Generic;
using System.Linq;
using Web.Models;
using WebApplication;

namespace Web.Services
{
    public class DatabaseSettingProvider
    {
        private readonly DatabaseContext _context;

        public DatabaseSettingProvider(DatabaseContext context)
        {
            this._context = context;
        }

        public string GetSettingValue(string settingId)
        {
            var databaseSetting = this._context.DatabaseSettings.SingleOrDefault(ds => ds.SettingId == settingId);
            
            if (databaseSetting == null)
            {
                throw new InvalidOperationException($"Could not find settingValue for settingId {settingId}");
            }

            return databaseSetting.SettingValue;
        }

        public IEnumerable<DatabaseSetting> GetDatabaseSettings()
        {
            return this._context.DatabaseSettings.ToList();
        }
    }
}