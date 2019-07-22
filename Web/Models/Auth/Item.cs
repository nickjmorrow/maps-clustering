using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Web.Models;
using WebApplication.Enums;

namespace WebApplication.Models
{
    [Table("items", Schema="mapClustering")]
    public class Item : IItemBound, IDeletable
    {
        [Key] 
        public int ItemId { get; set; }
        public int ItemTypeId { get; set; }
        public ItemPermissionType ItemPermissionTypeId { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateDeleted { get; set; }
    }
}