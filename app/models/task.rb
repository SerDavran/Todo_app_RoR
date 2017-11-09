class Task < ActiveRecord::Base
	belongs_to :state

  validates :state, :presence => true
  validates :title, :presence => true


  	def self.update_all_json
  		if ( Task.uniq.pluck(:state_id).count == 1 && Task.first.state_id == 3 )
  			state = 1
  		else
  			state = 3
  		end
  		Task.all.each { |t| t.update_attributes({ :state_id => state }) }
  		return state
  	end

    def self.count_active
      count = 0
      Task.all.each { |t| count += 1 if (t.state_id==1 || t.state_id==2)   }
      return count
    end

    def self.delete_complited_json
      Task.where(state_id: 3).destroy_all
    end
end
