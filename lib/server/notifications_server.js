_.extend( Notifications, {
	create: function ( userId, content, type ) {
		notifications.insert({
			userId   : userId,
			type     : ( type ) ? type : 'info',
			content  : content,
			createdAt: new Date()
		});
	},

	markAsRead: function ( notificationId ) {
		notifications.update( notificationId, {
			$set: {
				readAt: new Date()
			}
		});
	},

	delete: function(id) {
		var tmp = notifications.findOne({"_id": id});
		if(tmp && tmp.userId == Meteor.userId())
			notifications.remove({"_id": id});
	},

	deleteAllFromUser: function() {
		var userId = Meteor.userId();
		if(userId) notifications.remove({"userId": userId});
	},

	markAllAsRead: function () {
		var userId = Meteor.userId();
		if(!userId) return;
		notifications.update({"userId":userId}, {
			$set: {
				readAt: new Date()
			}
		}, {multi: true});
	},
});

Meteor.methods({
	'Notifications.markAsRead': function ( notificationId ) {
		Notifications.markAsRead( notificationId );
	},
	'Notifications.markAllAsRead': function () {
		Notifications.markAllAsRead();
	},
	'Notifications.deleteAllFromUser': function () {
		Notifications.deleteAllFromUser();
	},
	'Notifications.delete': function (id) {
		Notifications.delete(id);
	}
});
