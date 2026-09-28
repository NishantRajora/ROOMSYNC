up:
	docker compose up --build

seed:
	python backend/manage.py seed_demo

test:
	python -m pytest backend/tests -q

frontend:
	cd frontend && npm run dev

demo:
	python backend/scripts/demo.py
