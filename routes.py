from flask import Flask, render_template, request, session, redirect, url_for
from models import db, User
from forms import SignupForm, LoginForm

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://admin:abc123@localhost/pyApp'
#heroku = Heroku(app)
#db = sqlAlchemy(app)
db.init_app(app)

app.secret_key = "development-key"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if 'email' in session:
        return redirect(url_for('home'))

    form = SignupForm()
    if request.method == 'POST':
        if form.validate() == False:
            form_error_input = "form-error--textInput"
            return render_template("signup.html", form=form, form_error_input=form_error_input)
        else:
            newuser = User(form.first_name.data, form.last_name.data, form.email.data, form.password.data)
            db.session.add(newuser)
            db.session.commit()
            session['email'] = newuser.email
            session['firstname'] = newuser.firstname
            session['lastname'] = newuser.lastname

            return redirect(url_for('home'))

    elif request.method == "GET":
        return render_template('signup.html', form=form)

@app.route("/login", methods=["GET", "POST"])
def login():
    if 'email' in session:
        return redirect(url_for('home'))

    form = LoginForm()

    if request.method == "POST":
        if form.validate() == False:
            form_error_input = "form-error--textInput"
            return render_template('login.html', form=form, form_error_input=form_error_input)
        else:
            email = form.email.data
            password = form.password.data

            user = User.query.filter_by(email=email).first()
            if user is not None or user.check_password(password):
                session['email'] = form.email.data
                session['firstname'] = user.firstname
                session['lastname'] = user.lastname
                return redirect(url_for('home'))
            else:
                return redirect(url_for('login'))

    elif request.method == "GET":
        return render_template('login.html', form=form)

@app.route("/logout")
def logout():
    session.pop('email', None)
    session.pop('firstname', None)
    session.pop('lastname', None)
    return redirect(url_for('index'))

@app.route("/home")
def home():
    if 'email' not in session:
        return redirect(url_for('login'))

    return render_template("home.html")


if __name__ == "__main__":
    app.run(debug=True)
