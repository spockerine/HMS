from flask import Flask, jsonify, request, Response, session, render_template, redirect, url_for, make_response
from flask_cors import CORS
import os
import time
import base64
from pymongo import MongoClient
from cryptography.fernet import Fernet
import datetime

key = b'5HFFdBeSChtl1oWaEWwDhTi5Cr7s4LohO5W2zIngmHU='
cipher_suite = Fernet(key)

app = Flask(__name__)
app.secret_key = os.urandom(24) # for session
CORS(app)

client = MongoClient('localhost', 27017)
db = client['hms']

# specializations = ["heart specialist", "neurosurgean", "general physician"]

def getAllSpecializations():
	query = {"flag": 1}
	specialities = []
	#db = client['rough']
	collection = db["users"]

	docs = collection.find(query, {"specialization": 1})

	for doc in docs:
		if(doc["specialization"] in specialities):
			pass
		else:
			specialities.append(doc["specialization"])
	
	return specialities

	


@app.route('/')
def homepage():

	return render_template("index.html")

@app.route('/about')
def about():

	return render_template("about_page.html")

@app.route('/register', methods = ["GET", "POST"])
def register():
	
	if request.method == "GET":
		return render_template("register.html")
	
	else:
		#print("here")
		
		doc = {
				"_id" 				: request.form["username"],
				"flag" 				: 2,
				"firstname" 		: request.form["firstname"],
				"lastname"			: request.form["lastname"],
				"password" 			: cipher_suite.encrypt(request.form["password"].encode()),
				"dob"				: request.form["dob"],
				"gender" 			: request.form["gender"],
				"phone_number" 		: request.form["contact_no"],
				"email_id" 			: request.form["email"],
				"image"				: request.form["image"],
				"notify"			: False, 
				"appointments"		: {}
			  }
		
		collection = db['users']
		collection.insert_one(doc)
		
		# return "Registered successfully"
		resp = make_response(render_template(str(2) + "_home.html", name = doc['firstname'] + " " + doc['lastname']))
		resp.set_cookie("id", doc['_id'])
				
		return resp
		
@app.route('/check_user_name_exists', methods = ["GET"])
def check_user_name_exists():

	username = request.args['username']

	# query the database to check if the username exists
	# 	if exists:
	# 		send yes
	# 	else:
	#		send no

	collection = db['users']
	if collection.find_one({'_id': username }):
		return "username exists!!!"

	return ""

@app.route('/login', methods = ["GET", "POST"])
def login():
	
	if request.method == "GET":
		return render_template("login_page.html")

	else:
		username = request.form['username']
		password = request.form['password']

		collection = db['users']

		docs = collection.find_one({ '_id': username })

		if docs:
			print(docs['password'])
			if cipher_suite.decrypt(docs['password']).decode() == password:
				
				# html pages:
				# 	1_home.html => doctor
				# 	2_home.html => patient
				# 	3_home.html => admin
				# 	4_home.html => emergency

				if(int(docs["flag"]) == 3):
					resp = make_response(render_template(str(int(docs['flag'])) + "_home.html"))
					print(resp)
					resp.set_cookie("id", docs['_id'])	
				else:
					resp = make_response(render_template(str(int(docs['flag'])) + "_home.html", name = docs['name']))
					resp.set_cookie("id", docs['_id'])
				
				return resp

				# return "Render page : " + str(int(docs['flag'])) + "_home.html"

			else:
				return render_template("login_page.html", error_message = "Invalid password")	
		
		else:
			return render_template("login_page.html", error_message = "Invalid username")


@app.route('/logout', methods = ["GET"])
def logout():

	resp = redirect(url_for("homepage"))
	resp.set_cookie("id", "")
				
	return resp

@app.route('/search', methods = ["GET", "POST"])
def search():
	
	if request.method == "GET":
		return render_template("search.html")
	
	else:
		specialities = getAllSpecializations()
		doctor_name = request.form['doctor_name']

		if(doctor_name in specialities):
			query = {
					  'flag': 1,
					  'specialization': doctor_name
					}	
		else:
			# print("here")
			query = { 
					  'flag': 1,  
					  'name': doctor_name 
					}

		# db = client['rough']
		collection = db['users']
		
		doc = collection.find(query, { '_id': 0, 'password': 0, 'flag': 0, 'avg_time_per_patient': 0 })
		#doc = collection.find(query)
		
		l = []

		for i in doc:
			l.append(i)
		# if(doc):
		# 	doc['error_message'] = ""

		# else:
		# 	doc['error_message'] = "Error!! Requested Doctor details not found!"
		print(l)
		return jsonify(l)

@app.route("/doctor_name_suggestions", methods = ["GET"])
def doctor_name_suggestions():

	prefix = request.args['name']
	suggestions = []

	# db = client['rough']
	collection = db['users']

	docs = collection.find({ 'flag': 1 }) 

	specializations = getAllSpecializations()

	for doc in docs:
		if doc['name'].lower().startswith(prefix.lower()):
			suggestions.append(doc['name'])

	for i in specializations:
		if i.lower().startswith(prefix.lower()):
			suggestions.append(i)

	print(suggestions)

	return jsonify(suggestions)

@app.route("/doctors_speciality_suggestions", methods = ["GET"])
def doctors_speciality_suggestions():

	speciality = request.args['speciality']
	print(speciality)
	#db = client['rough']
	collection = db['users']
	
	doctor_list = []
	query = {'flag': 1, 'specialization': speciality}

	docs = collection.find(query, {"_id": 1, 'name': 1})

	for doc in docs:
		doctor_list.append(doc)

	print(doctor_list)
	return jsonify(doctor_list)

@app.route('/date_time_suggestions', methods = ["GET"])
def date_time_suggestions():

	date = request.args['date']
	doctor_id = request.args['doctor_id']
	specialization = request.args['speciality']

	#db = client['rough']
	collection = db['users']

	time_list = []

	query = {"_id": doctor_id}
	
	doc = collection.find_one(query, {"check_in_time": 1, "check_out_time": 1, "avg_time_per_patient": 1, "appointments": 1})

	avg_time_per_patient = int(doc["avg_time_per_patient"])

	print(doc['appointments'])
	try:
		appointments_date = doc['appointments'][date]
	except:
		appointments_date = []
	
	# appointments_date: dictionary
	# 	key : time
	# 	value : patient_id
	
	start_hours = int(doc["check_in_time"].split(":")[0])
	start_mins = int(doc["check_in_time"].split(":")[1])

	end_hours = int(doc["check_out_time"].split(":")[0])
	end_mins = int(doc["check_out_time"].split(":")[1])

	print(start_hours)
	print(start_mins)

	print(end_hours)
	print(end_mins)

	print(avg_time_per_patient)

	print(appointments_date)

	while((start_hours < end_hours) or (not((start_hours == end_hours) and (start_mins <= end_mins)))):
		appointment_time = str(start_hours) + ":" + str(start_mins)
		if(start_mins == 0):
			appointment_time += '0'
		if(appointment_time in appointments_date):
			pass
		else:
			time_list.append(appointment_time)

		start_mins += avg_time_per_patient

		if(start_mins >= 60):
			start_hours += 1
			start_mins = start_mins % 60
	
	return jsonify(time_list)

@app.route("/book_appointment", methods = ["GET", "POST"])
def book_appointment():
	
	if request.method == "GET":
		specialities = getAllSpecializations()

		return render_template("book_appointment.html", specialities = specialities)

	else:

		doctor_id = request.form['doctor_id']
		specialization = request.form['specialization']
		date = request.form['date']
		time = request.form['time']
		details = request.form['details']

		print(doctor_id)
		print(specialization)
		print(date)
		print(time)
		print(details)

		# save these details into the db for doctor and for patient also

		return "success"
 
@app.route("/add_doctor", methods = ["GET", "POST"])
def add_doctor():

	if request.method == "GET":
		return redirect(url_for("homepage"))

	else:
		name = request.form['name']
		username = request.form['username']
		password = cipher_suite.encrypt(request.form["password"].encode())
		email = request.form['email']
		dob = request.form['dob']
		phone_number = request.form['phone']
		check_in_time = request.form['check_in_time']
		check_out_time = request.form['check_out_time']
		avg_time_per_patient = request.form['avg_time_per_patient']
		qualification = request.form['qualification']
		specialization = request.form['specialization']
		achievements = request.form['achievements']
		experience = request.form['experience']
		about = request.form['about']
		flag = 1

		collection = db["users"]

		toInsert = {
			"_id": username,
			"flag": flag, 
			"name": name,
			"password": password,
			"email": email,
			"phone": phone_number,
			"dob": dob,
			"check_in_time": check_in_time,
			"check_out_time": check_out_time,
			"avg_time_per_patient": avg_time_per_patient,
			"qualification": qualification,
			"specialization": specialization,
			"achievements": achievements,
			"experience": experience,
			"about": about,
			"appointments": {},
			"inpatients": [], 
			"nurses": []
		}

		collection.insert_one(toInsert)
		
		return render_template("3_home.html")

@app.route("/add_nurse", methods = ["GET", "POST"])
def add_nurse():

	if request.method == "GET":
		return redirect(url_for("homepage"))

	else:
		name = request.form['name']
		username = request.form['username']	
		email = request.form['email']
		phone_number = request.form['phone']
		check_in_time = request.form['check_in_time']
		check_out_time = request.form['check_out_time']
		qualification = request.form['qualification']
		experience = request.form['experience']
		about = request.form['about']
		flag = 5
		

		collection = db["users"]

		toInsert = {
			"_id": username,
			"flag": flag, 
			"name": name,
			"email": email,
			"phone": phone_number,
			"check_in_time": check_in_time,
			"check_out_time": check_out_time,
			"qualification": qualification,
			"experience": experience,
			"about": about,
			"incharge_patients": {} # key => patient # value => doctor_id
		}

		collection.insert_one(toInsert)
		
		return render_template("3_home.html")

@app.route("/add_emergency_department", methods = ["GET", "POST"])
def add_emergency_department():

	if request.method == "GET":
		return redirect(url_for("homepage"))

	else:
		username = request.form['username']	
		password = cipher_suite.encrypt(request.form["password"].encode())
		flag = 4
		

		collection = db["users"]

		toInsert = {
			"_id": username,
			"flag": flag, 
			"password": password
		}

		collection.insert_one(toInsert)
		
		return render_template("3_home.html")

@app.route("/ward_info", methods = ["GET", "POST"])
def ward_info():

	if request.method == "GET":
		return redirect(url_for("homepage"))

	else:
		num_wards = request.form['wards']	

		collection = db["hospital_details"]

		wards = [1] * int(num_wards) 

		toInsert = {
			"_id": "wards",
			"availability": wards
		}

		collection.insert_one(toInsert)
		
		return render_template("3_home.html")

@app.route("/icu_info", methods = ["GET", "POST"])
def icu_info():

	if request.method == "GET":
		return redirect(url_for("homepage"))

	else:
		num_icu = request.form['icu']	

		collection = db["hospital_details"]

		icu = [1] * int(num_icu)

		toInsert = {
			"_id": "icu",
			"availability": icu
		}

		collection.insert_one(toInsert)
		
		return render_template("3_home.html")

@app.route("/provide_feedback", methods = ["GET", "POST"])
def provide_feedback():

	if request.method == "GET":
		speciality = getAllSpecializations()
		return render_template("feedback.html", specialities = speciality)
	else:
		now = datetime.datetime.now()
		now =  now.strftime("%d-%m-%Y %H:%M")
		date = now.split(" ")[0]
		time = now.split(" ")[1]

		
		doctor_id = request.form["doctor_id"]
		specialization = request.form["specialization"]
		feedback = request.form["details"]
		patient_id = request.cookies.get("id")

		collection = db["users"]
		doc = collection.find_one({"_id": doctor_id})

		doctor_name = doc['name']

		collection = db["feedback"]

		# print(date)
		# print(time)
		# print(patient_id)
		# print(doctor_id)
		# print(doctor_name)
		# print(specialization)
		# print(feedback)

		toInsert = {
			"patient_id": patient_id, 
			"doctor_id": doctor_id,
			"doctor_name": doctor_name,
			"date": date,
			"time": time,
			"specialization": specialization,
			"feedback": feedback
		}
		
		collection.insert_one(toInsert)

		speciality = getAllSpecializations()
		return render_template("feedback.html", specialities = speciality)
	
@app.route("/test")
def test():
	return render_template("register.html")


if __name__ == '__main__':
	app.run(host="0.0.0.0", port = 5001, debug = True, threaded = True)