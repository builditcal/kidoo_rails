class CreateProfiles < ActiveRecord::Migration[8.0]
  def change
    create_table :profiles do |t|
      t.string :first_name
      t.string :surname
      t.string :whatsapp_number

      t.timestamps
    end
  end
end
