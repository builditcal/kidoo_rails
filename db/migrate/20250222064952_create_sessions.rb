class CreateSessions < ActiveRecord::Migration[8.0]
  def change
    create_table :sessions do |t|
      t.references(:user, foreign_key: true, null: false, type: :bigint)
      t.string :ip_address
      t.string :user_agent

      t.timestamps
    end
  end
end
