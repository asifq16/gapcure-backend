variable "tables" {
  type = list(object({
    name                    = string
    read_capacity           = number
    write_capacity          = number
    attributes              = list(object({
      name = string
      type = string
    }))
    global_secondary_indexes = list(object({
      name               = string
      hash_key           = string
      range_key          = string
      projection_type    = string
      read_capacity      = number
      write_capacity     = number
    }))
  }))
  description = "List of maps containing the configurations for each DynamoDB table."
  default = [
    {
      name           = "PATIENT"
      read_capacity  = 5
      write_capacity = 5
      attributes = [
        {
          name = "id"
          type = "S"
        },
        {
          name = "name"
          type = "S"
        },
        {
          name = "identifier"
          type = "S"
        },
        {
          name = "pythoScore"
          type = "S"
        },
      ]
      global_secondary_indexes = [
        {
          name               = "Identifier-index"
          hash_key           = "identifier"
          range_key          = "name"
          projection_type    = "ALL"
          read_capacity      = 5
          write_capacity     = 5
        },
        {
          name               = "PythoScore-index"
          hash_key           = "pythoScore"
          range_key          = "name"  # Add the range key for the second index
          projection_type    = "ALL"
          read_capacity      = 5
          write_capacity     = 5
        },
      ]
    },
  ]
}
