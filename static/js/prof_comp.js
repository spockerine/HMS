console.clear();

var myApp = angular.module('myApp', []);

myApp.controller('MedicalProfileCtrl', function($scope){
	$scope.dataModel = {
		personalInfo: {
			'name': "John Doe",
			'phone': "444-333-5555",
			'dob': "04/01/2016",
			'gender': "Male",
			'height': "5'10''",
			'weight': "160 lb",
			'hairColor': "Black",
			'eyeColor': "Brown",
			'bloodType': "AB",
			'organDonor': "Yes" 
		},
		medicalQuest: {
			'name':"Blah",
            'ailment1': "NO",
			'ailment2': "NO",
			'ailment3': "NO",
                        
		},
        medicalConditions: [
			/*{
				'condition': "Headache", 
				'note': "Frequent headache when under stress."
			},
			{
				'condition': "Allergy", 
				'note': "Peanut and dairy product."
			}*/
		]
	};
});

myApp.directive('medicalPersonalInfo', function(){
	return {
		scope: {
			model: "=",
			id: "="
		},
		link: function(scope){
			var labels = {
				name: "Name",
				phone: "Phone #",
				dob: "Date of Birth",
				gender: "Gender",
				height: "Height",
				weight: "Weight",
				hairColor: "Hair Color",
				eyeColor: "Eye Color",
				bloodType: "Blood Type",
				organDonor: "Organ Donor"
			};
			
			// models
			angular.extend(scope, {
				labels: labels,
				viewModel: scope.model,
				editModel: {}
			});
			
			// automatically update viewModel if model change
			scope.$watch('model', function(newVal, oldVal){
				scope.viewModel = scope.model;
			});
			
			// methods
			angular.extend(scope, {
				showEditModalFn: function(viewModel, editModalId){
					scope.editModel = viewModel ? angular.copy(viewModel) : {};
					$(editModalId).modal('toggle');
				},
				saveEditFn: function(editModalId){
					// pass data back
					scope.model = angular.copy(scope.editModel);
					
					// clean UI
					$(editModalId).modal('toggle');
				}
			});
		},
		template: $("#medicalPersonalInfoTemplate").html(),
		replace: true
	};
});
myApp.directive('medicalConditions', function(){
	return {
		scope: {
			model: "=",
			id: "="
		},
		link: function(scope){
			var labels = {
				mode: "Add",
				condition: "Condition",
				note: "Note"
			};
			
			// models
			angular.extend(scope, {
				labels: labels,
				viewModel: scope.model,
				editModel: {}
			});
			
			// methods
			angular.extend(scope, {
				showEditModalFn: function(viewModel, index, editModalId){
					labels.mode = viewModel ? "Edit" : labels.mode;
					scope.editModel = viewModel ? angular.copy(viewModel) : {};
					scope.editModel.index = index;
					$(editModalId).modal('toggle');
				},
				saveEditFn: function(editModalId){
					// pass data back
					if (scope.editModel.index != null){
						scope.model[scope.editModel.index] = angular.copy(scope.editModel);
					} else {
						scope.model.push(angular.copy(scope.editModel));
					}
					
					// clean UI
					$(editModalId).modal('toggle');
				}
			});
		},
		template: $("#medicalConditionTemplate").html(),
		replace: true
	}
});

myApp.directive('medicalQuest', function(){
	return {
		scope: {
			model: "=",
			id: "="
		},
		link: function(scope){
			var labels = {
                ailment1: "Diabetes",
				ailment2: "High Blood Pressure",
				ailment3: "Bad Cholestrol",
				
			};
			
			// models
			angular.extend(scope, {
				labels: labels,
				viewModel: scope.model,
				editModel: {}
			});
			
			// automatically update viewModel if model change
			scope.$watch('model', function(newVal, oldVal){
				scope.viewModel = scope.model;
			});
			
			// methods
			angular.extend(scope, {
				showEditModalFn: function(viewModel, editModalId){
					scope.editModel = viewModel ? angular.copy(viewModel) : {};
					$(editModalId).modal('toggle');
				},
				saveEditFn: function(editModalId){
					// pass data back
					scope.model = angular.copy(scope.editModel);
					
					// clean UI
					$(editModalId).modal('toggle');
				}
			});
		},
		template: $("#medicalQuestTemplate").html(),
		replace: true
	};
});


myApp.directive('displayText', function(){
	return {
		scope: {
			label: "=",
			model: "="
		},
		template: $("#displayTextTemplate").html(),
		replace: true
	}
});

myApp.directive('formInput', function(){
	return {
		scope: {
			label: "=",
			model: "=",
			type: "@",
			pattern: "@",
			title: "@"
		},
		link: function(scope, element, attributes){
			if (scope.type){ element.find("input").attr("type", scope.type); }
			if (scope.pattern){ element.find("input").attr("pattern", scope.pattern); }
			if (scope.title){ element.find("input").attr("title", scope.title); }
		},
		template: $("#formInputTemplate").html(),
		replace: true
	}
});