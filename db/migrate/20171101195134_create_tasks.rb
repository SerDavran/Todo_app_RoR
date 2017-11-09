class CreateTasks < ActiveRecord::Migration
  def change
    create_table :tasks do |t|
      t.string :title
      t.references :state, index: true

      t.timestamps
    end
  end
end
