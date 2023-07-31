resource "aws_dynamodb_table" "tables" {
  for_each = { for table in var.tables : table.name => table }

  name           = each.value.name
  billing_mode   = "PROVISIONED"  # or "PAY_PER_REQUEST" for on-demand capacity mode

  dynamic "attribute" {
    for_each = each.value.attributes
    content {
      name = attribute.value.name
      type = attribute.value.type
    }
  }

  hash_key = "id"

  read_capacity  = each.value.read_capacity
  write_capacity = each.value.write_capacity

  dynamic "global_secondary_index" {
    for_each = each.value.global_secondary_indexes
    content {
      name            = global_secondary_index.value.name
      hash_key        = global_secondary_index.value.hash_key
      range_key       = global_secondary_index.value.range_key
      projection_type = global_secondary_index.value.projection_type
      read_capacity   = global_secondary_index.value.read_capacity
      write_capacity  = global_secondary_index.value.write_capacity
    }
  }
}
