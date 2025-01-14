const { model, Schema } = require('mongoose');

const tasksSchema = Schema({
    text: {type: String, required: true},
    done: {type: Boolean, required: true},
    priority: { type: String, required: true },
    date: {type: String, required: true},
}, {versionKey: false});


/**********Agregacion*************/
tasksSchema.statics.aggregateByPriority = async function () {
    return this.aggregate([
      {
        $group: {
          _id: "$priority",
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: {
              $cond: [{ $eq: ["$done", true] }, 1, 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  };

const Task = model("Task", tasksSchema);

module.exports=Task;