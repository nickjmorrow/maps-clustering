using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Web.Models;
using WebApplication.Enums;

namespace WebApplication.Models
{
    [Table("items", Schema="dbo")]
    public class Item : IItemBound
    {
        [Key] 
        public int ItemId { get; set; }
        public int ItemTypeId { get; set; }
        public ItemPermissionType ItemPermissionType { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateDeleted { get; set; }
    }
}